/**
 * Model Bubble Component
 * Floating model selector bubble
 */

import { chatStore, setModel } from '../../state/chat';
import { AVAILABLE_MODELS } from '../../state/auth';
import type { AIModel } from '../../lib/types';

export class ModelBubble {
  private container: HTMLElement;
  private isExpanded: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();

    // Subscribe to chat store changes
    chatStore.subscribe(() => {
      this.render();
    });
  }

  private render(): void {
    const state = chatStore.getState();
    const selectedModel = state.chatState.selectedModel;

    this.container.className =
      'fixed bottom-24 right-6 z-20 transition-all duration-300';

    this.container.innerHTML = `
      <div class="relative">
        ${this.isExpanded ? `
          <!-- Expanded Model List -->
          <div class="glass-modal rounded-lg p-4 w-72 max-h-96 overflow-y-auto mb-2 custom-scrollbar">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-300">Select Model</h3>
              <button 
                class="text-gray-400 hover:text-white"
                onclick="window.toggleModelBubble()"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="space-y-1">
              ${AVAILABLE_MODELS.map(model => `
                <button
                  class="w-full text-left p-2 rounded ${
                    selectedModel === model
                      ? 'bg-blue-500/30 text-white'
                      : 'glass-interactive text-gray-300'
                  } text-sm"
                  onclick="window.selectModel('${model}')"
                >
                  ${model}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Collapsed Model Button -->
        <button 
          class="glass-interactive bg-blue-500/20 px-4 py-3 rounded-full flex items-center gap-2 shadow-lg"
          onclick="window.toggleModelBubble()"
          title="Change AI model"
        >
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span class="text-sm font-medium text-white whitespace-nowrap">
            ${selectedModel}
          </span>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <style>
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
      </style>
    `;
  }

  public toggle(): void {
    this.isExpanded = !this.isExpanded;
    this.render();
  }
}

// Global functions
if (typeof window !== 'undefined') {
  let modelBubbleInstance: ModelBubble | null = null;

  (window as any).__setModelBubbleInstance = (instance: ModelBubble) => {
    modelBubbleInstance = instance;
  };

  (window as any).toggleModelBubble = () => {
    if (modelBubbleInstance) {
      modelBubbleInstance.toggle();
    }
  };

  (window as any).selectModel = (model: AIModel) => {
    setModel(model);
    if (modelBubbleInstance) {
      modelBubbleInstance.toggle();
    }
  };
}
