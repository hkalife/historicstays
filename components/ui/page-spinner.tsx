import { Spinner } from './spinner';

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  );
}
