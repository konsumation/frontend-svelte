export class User {
  constructor(json) {
    Object.assign(this, json);
  }

  get name()
  {
    return this.cn;
  }
}
