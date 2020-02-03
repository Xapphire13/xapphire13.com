import './styles/playground-experiment-page.less';
import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

type Props = RouteComponentProps<{ experiment: string }>;

export default function PlaygroundExperimentPage({ match }: Props) {
  const experimentName = match.params.experiment;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;

      const resizeFrame = () => {
        iframe.height = `${iframe.contentWindow!.document.body.scrollHeight}px`;
      };

      const frameObserver = new MutationObserver(() => resizeFrame);
      frameObserver.observe(iframe.contentDocument!, {
        childList: true,
        subtree: true
      });
      const script = iframe.contentDocument!.createElement('script');
      script.src = `/app/playground/${experimentName}.js`;
      iframe.contentDocument!.body.appendChild(script);

      return () => {
        frameObserver.disconnect();
      };
    }

    return () => {};
  }, [experimentName]);

  return (
    <div className="playground-experiment-page">
      <iframe title="experiment-frame" ref={iframeRef} src="about:blank" />
    </div>
  );
}
