/**
 * Simple hash-based router for SPA navigation
 * Compatible with GitHub Pages deployment
 */

export type RouteHandler = (params: URLSearchParams) => void | Promise<void>;

interface Route {
  path: string;
  handler: RouteHandler;
}

export class Router {
  private routes: Route[] = [];
  private fallbackHandler?: RouteHandler;
  private currentPath: string = '';

  constructor() {
    // Listen to hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  /**
   * Register a route
   */
  on(path: string, handler: RouteHandler): this {
    this.routes.push({ path, handler });
    return this;
  }

  /**
   * Set fallback handler for unmatched routes
   */
  otherwise(handler: RouteHandler): this {
    this.fallbackHandler = handler;
    return this;
  }

  /**
   * Navigate to a path
   */
  navigate(path: string, queryParams?: Record<string, string>): void {
    let url = `#${path}`;
    
    if (queryParams) {
      const params = new URLSearchParams(queryParams);
      url += `?${params.toString()}`;
    }
    
    window.location.hash = url;
  }

  /**
   * Get current path without hash
   */
  getCurrentPath(): string {
    return this.currentPath;
  }

  /**
   * Parse and handle current route
   */
  private async handleRoute(): Promise<void> {
    const hash = window.location.hash.slice(1) || '/';
    const [path, search] = hash.split('?');
    const params = new URLSearchParams(search);

    this.currentPath = path;

    // Find matching route
    const route = this.routes.find(r => r.path === path);

    if (route) {
      try {
        await route.handler(params);
      } catch (error) {
        console.error(`Error handling route ${path}:`, error);
      }
    } else if (this.fallbackHandler) {
      await this.fallbackHandler(params);
    } else {
      console.warn(`No handler found for route: ${path}`);
    }
  }

  /**
   * Initialize router and handle initial route
   */
  init(): void {
    this.handleRoute();
  }
}

// Create singleton router instance
export const router = new Router();
