import 'react';

declare module 'react' {
  interface HTMLAttributes {
    placeholder?: string;
  }
  // interface FunctionComponent<P = {}> {
  //   (props: P & { children: React.ReactNode }, context?: any): ReactNode;
  //   propTypes?: WeakValidationMap<P> | undefined;
  //   contextTypes?: ValidationMap<any> | undefined;
  //   defaultProps?: Partial<P> | undefined;
  //   displayName?: string | undefined;
  // }
}
