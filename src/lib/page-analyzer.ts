export class PageAnalyzer {
  analyzeDOM(): {
    forms: HTMLFormElement[];
    inputs: HTMLInputElement[];
    buttons: HTMLButtonElement[];
    links: HTMLAnchorElement[];
    interactiveElements: Element[];
  } {
    const forms = Array.from(document.querySelectorAll('form'));
    const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
    const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
    const links = Array.from(document.querySelectorAll('a[href]'));
    const interactiveElements = Array.from(
      document.querySelectorAll('[onclick], [role="button"], [tabindex]')
    );

    return {
      forms,
      inputs: inputs as HTMLInputElement[],
      buttons: buttons as HTMLButtonElement[],
      links: links as HTMLAnchorElement[],
      interactiveElements,
    };
  }

  getElementContext(element: Element): string {
    const label = this.findLabel(element);
    const placeholder = element.getAttribute('placeholder');
    const ariaLabel = element.getAttribute('aria-label');
    const title = element.getAttribute('title');
    const name = element.getAttribute('name');
    const id = element.getAttribute('id');

    return [label, placeholder, ariaLabel, title, name, id]
      .filter(Boolean)
      .join(' | ');
  }

  findLabel(element: Element): string | null {
    const id = element.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || null;
    }

    const parentLabel = element.closest('label');
    if (parentLabel) return parentLabel.textContent?.trim() || null;

    return null;
  }

  getElementSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    
    const classes = Array.from(element.classList).slice(0, 2).join('.');
    if (classes) return `${element.tagName.toLowerCase()}.${classes}`;
    
    const name = element.getAttribute('name');
    if (name) return `${element.tagName.toLowerCase()}[name="${name}"]`;
    
    return element.tagName.toLowerCase();
  }

  isVisible(element: Element): boolean {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.offsetParent !== null
    );
  }

  getPageHTML(): string {
    return document.documentElement.outerHTML;
  }

  getPageText(): string {
    return document.body.innerText;
  }
}

export const pageAnalyzer = new PageAnalyzer();
