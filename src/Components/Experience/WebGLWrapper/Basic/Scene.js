export default class Scene {
  constructor() {
    this.predefinedChildren = [];
    this.externalChildren = [];
    this.children = [...this.predefinedChildren, ...this.externalChildren];
  }
  add(object) {
    this.predefinedChildren.push(object);
  }
  mergeChildren = () => {
    this.children = [...this.predefinedChildren, ...this.externalChildren];
    console.log('merging scene');
  };
}
