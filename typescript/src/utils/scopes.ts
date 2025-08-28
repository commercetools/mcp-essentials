import {Actions, Configuration} from '../types/configuration';

type Action = {[key: string]: Permission};
type Permission = {[actions: string]: boolean};

const adminScope = ['manage_project', 'manage_api_clients', 'view_api_clients'];

export function scopesToActions(
  scopes: Array<string>,
  configuration: Configuration
): Actions {
  const actions: Action = configuration.actions || {};
  if (scopes.some((scope) => adminScope.includes(scope))) {
    return Object.fromEntries(
      Object.entries(actions).map(([resource, {read, create, update}]) => {
        return [
          resource,
          {
            ...(read == undefined ? {} : {read}),
            ...(create == undefined ? {} : {create}),
            ...(update == undefined ? {} : {update}),
          },
        ];
      })
    );
  }

  return scopes.reduce((acc: Action, scope: string) => {
    // eslint-disable-next-line prefer-const
    let [type, ...resourceParts] = scope.split('_');

    // for scopes such as 'manage_my_orders' => ['manage', 'my', 'orders']
    if (resourceParts[0] == 'my') {
      type = type + '_' + resourceParts.shift(); // manage_my
    }

    const resource = resourceParts.join('-');
    const permissions =
      // eslint-disable-next-line no-nested-ternary
      type == 'view'
        ? ['read']
        : ['manage', 'manage_my'].includes(type)
          ? ['read', 'create', 'update']
          : [];

    if (!actions[resource]) return acc;

    acc[resource] = acc[resource] || {};
    permissions.forEach((permission) => {
      if (permission in actions[resource]) {
        acc[resource][permission] = actions[resource][permission];
      }
    });

    return acc;
  }, {});
}
