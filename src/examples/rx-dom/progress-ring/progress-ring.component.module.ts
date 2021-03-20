export default ($: any, constantsToImport: any) => {
  return (
    (
      {
        nodeAppendChild,
        createDocumentFragment,
        createElement,
        setAttributeValue,
        setReactiveAttribute,
        setReactiveStyle,
        $,
      }
    ) => {
      const parentNode = createDocumentFragment();
      {
        // element 'svg'
        const node = createElement('svg');
        nodeAppendChild(parentNode, node);
        // attributes
        // reactive attribute 'width'
        setReactiveAttribute($.diameter, node, 'width');
        // reactive attribute 'height'
        setReactiveAttribute($.diameter, node, 'height');
        {
          // child nodes
          const parentNode = node;
          {
            // element 'circle'
            const node = createElement('circle');
            nodeAppendChild(parentNode, node);
            // attributes
            // static attribute 'stroke'
            setAttributeValue(node, 'stroke', 'red');
            // static attribute 'fill'
            setAttributeValue(node, 'fill', 'transparent');
            // reactive attribute 'r'
            setReactiveAttribute($.innerRadius, node, 'r');
            // reactive attribute 'cx'
            setReactiveAttribute($.radius, node, 'cx');
            // reactive attribute 'cy'
            setReactiveAttribute($.radius, node, 'cy');
            // reactive attribute 'stroke-width'
            setReactiveAttribute($.strokeWidth, node, 'stroke-width');
            // reactive attribute 'stroke-dasharray'
            setReactiveAttribute($.strokeDashArray, node, 'stroke-dasharray');
            // reactive style 'stroke-dashoffset'
            setReactiveStyle($.strokeDashOffset, node, 'stroke-dashoffset');
            // reactive attribute 'transform'
            setReactiveAttribute($.transform, node, 'transform');
          }
        }
      }
      return parentNode;
    }
  )({
    ...constantsToImport,
    $,
  });
};
