// components/CopyButton/CopyButton.tsx
import React, { useState } from 'react';
import styles from './CopyButton.module.css';
import { useIntl } from 'react-intl'

interface CopyButtonProps {
  textToCopy: string;
  buttonLabel?: string;
  successLabel?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  buttonLabel,
  successLabel,
}) => {
  const intl = useIntl()
  
  const [copied, setCopied] = useState(false);
  buttonLabel = intl.formatMessage({id: 'homepage.copyButton.copy'});
  successLabel = intl.formatMessage({id: 'homepage.copyButton.coppied'});

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className={styles.copyButton}
      onClick={handleCopy}
      disabled={copied}
    >
      {copied ? successLabel : buttonLabel}
    </button>
  );
};
