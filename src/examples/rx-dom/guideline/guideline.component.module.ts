export default ($: any, constantsToImport: any) => {
  return (
    (
      {
        nodeAppendChild,
        createDocumentFragment,
        createElement,
        setReactiveProperty,
        of,
        $,
      }
    ) => {
      const parentNode = createDocumentFragment();
      {
        // element 'app-progress-ring'
        const node = createElement("app-progress-ring");
        nodeAppendChild(parentNode, node);
        // attributes
        // reactive property 'progress'
        setReactiveProperty(of(0.75), node, "progress");
        // reactive property 'radius'
        setReactiveProperty(of(60), node, "radius");
      }
      return parentNode;
    }
  )({
    ...constantsToImport,
    $,
  });
}
