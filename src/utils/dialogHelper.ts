/**
 * 现代 Top-Layer <dialog> 渐进增强辅助工具
 * 1. 支持原生 closedby="any" 遮罩轻点关闭，并为不支持 closedBy 的浏览器提供精准坐标回退。
 * 2. 探测离散 display 过渡支持度，为 Firefox / Safari 等浏览器提供平滑退场动画回退。
 */

let cachedSupportsDisplayTransition: boolean | undefined;

function canTransitionDisplay(): boolean {
  if (cachedSupportsDisplayTransition !== undefined) {
    return cachedSupportsDisplayTransition;
  }
  if (
    typeof window === 'undefined' ||
    !window.CSS?.supports?.('transition-behavior', 'allow-discrete') ||
    !document.body
  ) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  void getComputedStyle(probe).display;
  probe.style.display = 'none';
  cachedSupportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return cachedSupportsDisplayTransition;
}

function supportsTopLayerExit(): boolean {
  return Boolean(window.CSS?.supports?.('overlay', 'auto')) && canTransitionDisplay();
}

export async function closeDialogSmoothly(dialog: HTMLDialogElement | null): Promise<void> {
  if (!dialog || !dialog.open) return;

  if (!supportsTopLayerExit()) {
    dialog.setAttribute('data-closing', '');
    const animations = dialog.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((anim) => anim.finished)),
        new Promise((resolve) => setTimeout(resolve, 400)),
      ]);
    }
    if (!dialog.hasAttribute('data-closing')) return;
    dialog.removeAttribute('data-closing');
  }

  dialog.close();
}

export function attachDialogEnhancements(
  dialog: HTMLDialogElement | null,
  onAfterClose?: () => void
): () => void {
  if (!dialog) return () => {};

  const handleCancel = (event: Event) => {
    event.preventDefault();
    void closeDialogSmoothly(dialog);
  };

  const handleClose = () => {
    dialog.removeAttribute('data-closing');
    onAfterClose?.();
  };

  // 针对不支持 HTMLDialogElement.prototype.closedBy 的浏览器补充遮罩点击回退
  const needsLightDismissFallback =
    typeof HTMLDialogElement !== 'undefined' && !('closedBy' in HTMLDialogElement.prototype);

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInsideBox =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (!isInsideBox) {
      void closeDialogSmoothly(dialog);
    }
  };

  dialog.addEventListener('cancel', handleCancel);
  dialog.addEventListener('close', handleClose);
  if (needsLightDismissFallback) {
    dialog.addEventListener('click', handleBackdropClick);
  }

  return () => {
    dialog.removeEventListener('cancel', handleCancel);
    dialog.removeEventListener('close', handleClose);
    if (needsLightDismissFallback) {
      dialog.removeEventListener('click', handleBackdropClick);
    }
  };
}
