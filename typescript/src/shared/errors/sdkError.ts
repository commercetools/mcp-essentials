export class SDKError extends Error {
  constructor(message: string, error: any) {
    let details: string[] = [];

    // Handle commercetools API errors
    if (error.body?.errors) {
      details = error.body.errors
        .map((e: any) => e.detailedErrorMessage || e.message)
        .filter((item: string) => !!item);
    }

    // Handle Error objects (like the one from base.functions.ts)
    if (error instanceof Error && error.message) {
      details.push(error.message);
    } else if (error.message) {
      details.push(error.message);
    }

    const errorMessage = details.length > 0
      ? `${message}: ${details.join(', ')}`
      : message;

    super(errorMessage);
    this.name = 'SDKError';
  }
}
