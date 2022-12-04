declare module 'react-console-emulator' {
  import * as React from 'react';
  import * as CSS from 'csstype';

  interface OptionProps {
    autoFocus: boolean;
    dangerMode: boolean;
    disableOnProcess: boolean;
    noDefaults: boolean;
    noAutomaticStdout: boolean;
    noHistory: boolean;
    noAutoScroll: boolean;
  }

  interface LabelProps {
    welcomeMessage: boolean | string | string[];
    promptLabel: string;
    errorText: string;
  }

  interface CommandProps {
    commands?: {
      description: string;
      usage?: string;
      fn: () => string;
    };
    commandCallback?: () => {};
  }

  export type TerminalProps = CommandProps &
    LabelProps &
    OptionProps &
    StyleProps;

  export default class Terminal extends React.Component<TerminalProps, {}> {}
}
