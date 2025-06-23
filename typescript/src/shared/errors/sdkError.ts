export class SDKError extends Error {
  constructor(message: string, error: any) {
    const details = error.body?.errors
      ?.map((e: any) => e.detailedErrorMessage || e.message)
      .filter((item: string) => !!item);
    const errorMessage =
      message + (details?.length ? ` ${details.join(', ')}` : '');

    super(errorMessage);
    this.name = 'SDKError';
  }
}
