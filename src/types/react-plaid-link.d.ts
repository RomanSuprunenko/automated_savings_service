declare module "react-plaid-link" {
  export type PlaidLinkError = {
    error_code?: string;
    error_message?: string;
    display_message?: string;
    error_type?: string;
    message: string;
  };

  export type PlaidLinkOnSuccess = (
    publicToken: string,
    metadata: Record<string, unknown>
  ) => void;

  export type PlaidLinkOnExit = (error: PlaidLinkError | null, metadata: Record<string, unknown>) => void;

  export type UsePlaidLinkOptions = {
    token: string | null;
    onSuccess: PlaidLinkOnSuccess;
    onExit?: PlaidLinkOnExit;
  };

  export type UsePlaidLinkReturn = {
    open: () => void;
    ready: boolean;
    error: PlaidLinkError | null;
  };

  export function usePlaidLink(options: UsePlaidLinkOptions): UsePlaidLinkReturn;
}
