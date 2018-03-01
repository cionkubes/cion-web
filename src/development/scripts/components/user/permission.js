import m from "mithril";
import { createNotification } from "../notifications/panel";
import { map, pipe } from "../../helpers/fp";
import { req_with_auth } from "scripts/helpers/requests";
import permissionsStyle from "./permissions.useable";

export const PermissionForm = {
  oninit(vnode) {
    let t = this;
    req_with_auth({
      url: "/api/v1/permissions/permission-def",
      method: "GET",
      then: e => {
        this.permissionTemplate = e;
      },
      catch: e =>
        createNotification("Failed to get permission template", e, "error"),
      this: t
    });
  },

  removeEmptyPermissions(obj) {
    if (obj.constructor === Array) {
      return;
    } else if (typeof obj === "object") {
      Object.keys(obj).forEach(key => {
        // console.log('testing', obj);
        if (obj.hasOwnProperty(key) && !PermissionForm.hasValues(obj[key])) {
          delete obj[key];
        } else {
          PermissionForm.removeEmptyPermissions(obj[key]);
        }
      });
    }
  },

  hasValues(tree) {
    if (tree.constructor === Array) {
      // console.log('testing', tree);
      return tree.length > 0;
    } else {
      return Object.keys(tree).some(key => PermissionForm.hasValues(tree[key]));
    }
  },

  setPermission(path, val, dict) {
    // console.log('Setting permission', path, dict);
    let k = path[0];
    if (dict.constructor === Array) {
      if (val) {
        dict.push(k);
      } else {
        dict.splice(dict.indexOf(k), 1);
      }
    } else {
      if (val) {
        // add permission
        if (!(k in dict)) {
          if (path.length > 2) {
            dict[k] = {};
          } else {
            dict[k] = [];
          }
        }
      }
      PermissionForm.setPermission(path.slice(1), val, dict[k]);
    }
  },

  getValueFromPath(dict, path) {
    if (dict === undefined) {
      return false;
    }
    // console.log(dict, path);
    if (dict.constructor === Array) {
      if (path.length > 1) {
        return false;
      } else {
        return dict.indexOf(path[0]) > -1;
      }
    } else {
      return PermissionForm.getValueFromPath(dict[path[0]], path.slice(1));
    }
  },

  joinPath(pathSoFar, nVal) {
    let p = pathSoFar.slice(0);
    p.push(nVal);
    return p;
  },

  getPathAsString(pathSoFar) {
    return pathSoFar.join("/");
  },

  getPathStringAsPath(pathString) {
    return pathString.split("/");
  },

  generateCheckboxes(arr, pathSoFar, permissions) {
    let checkboxes = [];

    for (let permissionKey of arr) {
      let completePath = PermissionForm.joinPath(pathSoFar, permissionKey);
      let pathString = PermissionForm.getPathAsString(completePath);
      let checked = PermissionForm.getValueFromPath(permissions, completePath);
      let checkbox = m("input", {
        type: "checkbox",
        id: pathString,
        onchange: m.withAttr(
          "checked",
          val => {
            PermissionForm.setPermission(completePath, val, permissions);
            // TODO move call to removeEmptyPermissions to call it once when permissions are extracted
            // PermissionForm.removeEmptyPermissions(permissions);
            console.log("permissions:", permissions);
          },
          this
        ),
        text: permissionKey,
        checked: checked
      });
      checkboxes.push(
        m("div.permission", [
          m("label.permission-label", [checkbox, permissionKey])
        ])
      );
    }
    return checkboxes;
  },

  generatePermissionForm(dict, pathSoFar, permissions) {
    let objs = [];
    for (let key in dict) {
      if (!dict.hasOwnProperty(key)) {
        continue;
      }
      let o = dict[key];
      if (o.constructor === Array) {
        objs.push(
          m("div.permission-group", [
            m("h" + (pathSoFar.length + 4) + ".checkbox-header", key),
            PermissionForm.generateCheckboxes(
              o,
              PermissionForm.joinPath(pathSoFar, key).slice(0),
              permissions
            )
          ])
        );
      } else if (typeof o === "object") {
        objs.push(
          m("div.permission-group", [
            m("h" + (pathSoFar.length + 4) + ".zero-margin", key),
            PermissionForm.generatePermissionForm(
              o,
              PermissionForm.joinPath(pathSoFar, key).slice(0),
              permissions
            )
          ])
        );
      }
    }
    return objs;
  },

  view(vnode) {
    return m(
      "div.permissions",
      PermissionForm.generatePermissionForm(
        this.permissionTemplate,
        [],
        this.permissions
      )
    );
  },
  oncreate(vnode) {
    this.permissions = vnode.attrs.permissions;
    permissionsStyle.ref();
  },
  onremove() {
    permissionsStyle.unref();
  }
};
