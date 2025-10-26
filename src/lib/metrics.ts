import { Counter, Histogram, Registry } from 'prom-client';
import ddTrace from 'dd-trace';
import logger from './logger';

// Initialize Datadog tracer if configured
let tracer: any = undefined;
if (process.env.DD_ENABLED === 'true') {
    tracer = ddTrace.init({
        env: process.env.NODE_ENV,
        service: 'tempo-assistant',
        version: process.env.npm_package_version,
    });
}

// Initialize Prometheus registry
const registry = new Registry();

// Define metrics
const requestCounter = new Counter({
    name: 'api_requests_total',
    help: 'Total number of API requests',
    labelNames: ['endpoint', 'status'],
    registers: [registry],
});

const latencyHistogram = new Histogram({
    name: 'api_request_duration_seconds',
    help: 'API request latency',
    labelNames: ['endpoint'],
    buckets: [0.1, 0.5, 1, 2, 5],
    registers: [registry],
});

const costGauge = new Counter({
    name: 'ai_request_cost_dollars',
    help: 'Total cost of AI requests in dollars',
    labelNames: ['model'],
    registers: [registry],
});

// Cost constants (example rates)
const COST_PER_TOKEN = {
    'gemini-pro': 0.00001,
    'gemini-pro-vision': 0.00002,
};

// Legacy counter for backward compatibility
const legacyCounters: Record<string, number> = {};

export function incr(metric: string, n = 1) {
    legacyCounters[metric] = (legacyCounters[metric] || 0) + n;
    if (process.env.METRICS_DEBUG === '1') {
        // eslint-disable-next-line no-console
        console.info(`[metrics] ${metric} = ${legacyCounters[metric]}`);
    }
}

export function getMetric(metric: string) {
    return legacyCounters[metric] || 0;
}

export function resetMetrics() {
    Object.keys(legacyCounters).forEach((k) => delete legacyCounters[k]);
}

// Track metrics with both Prometheus and Datadog
export function trackRequest(endpoint: string, status: number, duration: number) {
    // Prometheus metrics
    requestCounter.inc({ endpoint, status: status.toString() });
    latencyHistogram.observe({ endpoint }, duration);

    // Datadog metrics if enabled
    if (tracer) {
        const span = tracer.startSpan('api.request');
        span.setTag('endpoint', endpoint);
        span.setTag('status', status.toString());
        span.setTag('duration', duration);
        span.finish();
    }
}

export function trackCost(model: string, tokens: number) {
    const cost = (COST_PER_TOKEN[model as keyof typeof COST_PER_TOKEN] || 0) * tokens;

    // Prometheus metrics
    costGauge.inc({ model }, cost);

    // Datadog metrics if enabled
    if (tracer) {
        const span = tracer.startSpan('ai.cost');
        span.setTag('model', model);
        span.setTag('cost', cost);
        span.setTag('tokens', tokens);
        span.finish();
    }

    // Cost alert (example threshold)
    const DAILY_COST_THRESHOLD = process.env.COST_ALERT_THRESHOLD ?
        parseFloat(process.env.COST_ALERT_THRESHOLD) :
        50.0; // Default $50/day threshold

    if (cost > DAILY_COST_THRESHOLD) {
        logger.warn({
            cost,
            model,
            threshold: DAILY_COST_THRESHOLD,
        }, 'Daily AI cost threshold exceeded');
    }
}

// Expose Prometheus metrics endpoint
export async function getMetrics(): Promise<string> {
    return registry.metrics();
}
