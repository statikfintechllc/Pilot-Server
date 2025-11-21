# Process JavaScript

This directory contains JavaScript modules for process management and workflows.

## Purpose

Process-specific JavaScript for:
- State management
- Workflow orchestration
- Event handling
- Data transformation
- Process coordination

## Architecture

### State Machine Pattern

```javascript
class ProcessStateMachine {
  constructor() {
    this.state = 'idle';
    this.transitions = {
      'idle': ['start'],
      'running': ['complete', 'error'],
      'complete': ['reset'],
      'error': ['retry', 'reset']
    };
  }
  
  canTransition(to) {
    return this.transitions[this.state].includes(to);
  }
  
  transition(to) {
    if (!this.canTransition(to)) {
      throw new Error(`Cannot transition from ${this.state} to ${to}`);
    }
    this.state = to;
    this.onStateChange(to);
  }
  
  onStateChange(newState) {
    // Trigger events, update UI, etc.
    console.log(`State changed to: ${newState}`);
  }
}
```

### Event-Driven Processing

```javascript
class ProcessEventBus {
  constructor() {
    this.listeners = {};
  }
  
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

// Usage
const bus = new ProcessEventBus();
bus.on('process:start', (data) => {
  console.log('Process started', data);
});
bus.emit('process:start', { id: 123 });
```

## Best Practices

1. **Clear State Management**: Use well-defined states
2. **Error Handling**: Handle all error cases
3. **Async Operations**: Use async/await properly
4. **Event Cleanup**: Remove event listeners when done
5. **Testing**: Write tests for all states and transitions

## Example Workflow

```javascript
class TradeProcessWorkflow {
  async execute(tradeData) {
    try {
      // Validate
      await this.validate(tradeData);
      
      // Process
      const processed = await this.process(tradeData);
      
      // Store
      await this.store(processed);
      
      // Notify
      this.notify('success', processed);
      
      return processed;
    } catch (error) {
      this.notify('error', error);
      throw error;
    }
  }
  
  async validate(data) {
    if (!data.symbol) {
      throw new Error('Symbol is required');
    }
    // More validation...
  }
  
  async process(data) {
    // Business logic
    return {
      ...data,
      processed: true,
      timestamp: Date.now()
    };
  }
  
  async store(data) {
    // Store in database or local storage
    localStorage.setItem(`trade_${data.id}`, JSON.stringify(data));
  }
  
  notify(type, data) {
    // Emit events or update UI
    window.dispatchEvent(new CustomEvent(`trade:${type}`, { detail: data }));
  }
}
```

## Error Handling

```javascript
// Centralized error handler
class ProcessErrorHandler {
  handle(error, context) {
    console.error(`Error in ${context}:`, error);
    
    // Log to analytics service
    this.logError(error, context);
    
    // Show user-friendly message
    this.showUserMessage(this.getUserMessage(error));
    
    // Optionally retry
    if (this.shouldRetry(error)) {
      return this.retry(context);
    }
  }
  
  getUserMessage(error) {
    const messages = {
      'NetworkError': 'Connection issue. Please check your internet.',
      'ValidationError': 'Please check your input and try again.',
      'default': 'Something went wrong. Please try again.'
    };
    return messages[error.name] || messages.default;
  }
}
```

## Testing

Test all process states:

```javascript
// Example test
async function testTradeProcess() {
  const workflow = new TradeProcessWorkflow();
  
  try {
    const result = await workflow.execute({
      symbol: 'AAPL',
      shares: 100,
      price: 150.00
    });
    console.assert(result.processed === true, 'Should be marked as processed');
    console.log('Test passed');
  } catch (error) {
    console.error('Test failed:', error);
  }
}
```

## Related Files

- Rendering: `../render/`
- Styles: `../css/`
- Asset store: `../../asset.store/js/`
