export default ($: any, $content: any, constantsToImport: any) => {
  return (
    (
      {
        nodeAppendChild,
        createDocumentFragment,
        createTextNode,
        createReactiveTextNode,
        createElement,
        setAttributeValue,
        setReactiveProperty,
        setReactiveClass,
        setReactiveEventListener,
        $,
        $content,
      }
    ) => {
      const parentNode = createDocumentFragment();
      {
        // element 'div'
        const node = createElement('div');
        nodeAppendChild(parentNode, node);
        // attributes
        // static attribute 'class'
        setAttributeValue(node, 'class', 'input-container');
        {
          // child nodes
          const parentNode = node;
          {
            // element 'input'
            const node = createElement('input');
            nodeAppendChild(parentNode, node);
            // attributes
            // reference 'input'
            var input = node;
            // reactive property 'value'
            setReactiveProperty($.input.subscribe, node, 'value');
            // reactive event listener 'input'
            setReactiveEventListener(() => $.input.emit(input.value), node, 'input');
          }
        }
      }
      {
        // element 'div'
        const node = createElement('div');
        nodeAppendChild(parentNode, node);
        // attributes
        // static attribute 'class'
        setAttributeValue(node, 'class', 'max-length-container');
        // reactive class 'valid'
        setReactiveClass($.valid, node, 'valid');
        {
          // child nodes
          const parentNode = node;
          // static text node
          nodeAppendChild(parentNode, createTextNode('Length: '));
          // reactive text node
          nodeAppendChild(parentNode, createReactiveTextNode($.remaining));
          // static text node
          nodeAppendChild(parentNode, createTextNode(' / 10'));
        }
      }
      return parentNode;
    }
  )({
    ...constantsToImport,
    $,
    $content,
  });
}
