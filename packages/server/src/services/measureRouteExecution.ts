function measureRouteExecution<T = unknown>(
  handler: (props: any) => Promise<T>
) {
  return async function measuredHandler(props: any): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await handler(props);

      const url = new URL(props.request.url);
      const endTime = performance.now();

      const duration = (endTime - startTime).toFixed(2);

      console.log({
        domain: url.hostname,
        pathname: url.pathname,
        method: props.request.method,
        duration,
      });

      return result as T;
    } catch (error) {
      const endTime = performance.now();
      console.error("");
      throw error;
    }
  };
}

export { measureRouteExecution };
