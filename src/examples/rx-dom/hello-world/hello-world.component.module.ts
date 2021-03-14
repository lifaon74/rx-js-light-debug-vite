export default ($: any, constantsToImport: any) => {
  return (
    (
      {
        nodeAppendChild,
        createDocumentFragment,
        createTextNode,
        createReactiveTextNode,
        createElementNode,
        setAttributeValue,
        setReactiveProperty,
        setReactiveClass,
        setReactiveEventListener,
        $,
      }
    ) => {
      const parentNode = createDocumentFragment();
      {
        const node = createElementNode("div");
        nodeAppendChild(parentNode, node);
        setAttributeValue(node, "class", "input-container");
        {
          const parentNode = node;
          {
            const node = createElementNode("input");
            nodeAppendChild(parentNode, node);
            var input = node;
            setReactiveProperty($.input.subscribe, node, "value");
            setReactiveEventListener(() => $.input.emit(input.value), node, "input");
          }
        }
      }
      {
        const node = createElementNode("div");
        nodeAppendChild(parentNode, node);
        setAttributeValue(node, "class", "max-length-container");
        setReactiveClass($.valid, node, "valid");
        {
          const parentNode = node;
          nodeAppendChild(parentNode, createTextNode("Length: "));
          nodeAppendChild(parentNode, createReactiveTextNode($.remaining));
          nodeAppendChild(parentNode, createTextNode(" / 10"));
        }
      }
      return parentNode;
    }
  )({
    ...constantsToImport,
    $,
  });
};
