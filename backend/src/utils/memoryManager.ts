export class MemoryManager {
    private static instance: MemoryManager;
    private allocations: Map<string, any[]> = new Map();
  
    static getInstance() {
      if (!MemoryManager.instance) {
        MemoryManager.instance = new MemoryManager();
      }
      return MemoryManager.instance;
    }
  
    trackAllocation(context: string, data: any) {
      if (!this.allocations.has(context)) {
        this.allocations.set(context, []);
      }
      this.allocations.get(context)!.push(data);
    }
  
    releaseMemory(context: string) {
      if (this.allocations.has(context)) {
        this.allocations.get(context)!.length = 0;
        this.allocations.delete(context);
      }
    }
  
    static monitor() {
      setInterval(() => {
        const usage = process.memoryUsage();
        console.log(`[Memory] RSS: ${Math.round(usage.rss / 1024 / 1024)}MB, Heap: ${Math.round(usage.heapUsed / 1024 / 1024)}MB`);
      }, 5000);
    }
  }