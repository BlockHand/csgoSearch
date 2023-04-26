export * from './validator';

/* Components */
const components= import.meta.globEager('./*/index.vue')
export default {
  install(app) {
    Object.keys(components).forEach(key => {
    let component = components[key].default
    app.component(component.name, component)
  })
  },
};
