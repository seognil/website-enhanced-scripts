/**
 * 对所有满足 selector 的节点，每个执行 callback
 * - 当前 query
 * - MutationObserver 监听未来的节点
 */
export const domObserverAll = (selector: string, callback: (node: HTMLElement) => void) => {
  const set = new WeakSet<HTMLElement>();

  const emit = (node: HTMLElement) => {
    if (set.has(node)) return;
    set.add(node);
    callback(node);
  };

  document.querySelectorAll(selector).forEach((n) => emit(n as HTMLElement));

  new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      mutation.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return;
        const nodes = n.matches(selector) ? [n] : n.querySelectorAll(selector);
        nodes.forEach((n) => emit(n));
      });
    });
  }).observe(document, { attributes: false, childList: true, subtree: true });
};
