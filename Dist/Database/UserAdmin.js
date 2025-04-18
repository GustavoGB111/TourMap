"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _userAdmin_userList;
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAdmin = void 0;
class userAdmin {
    constructor() {
        _userAdmin_userList.set(this, new Map());
    }
    create(user) {
        const { nome, email, senha } = user;
    }
    list() {
        return Array.from(__classPrivateFieldGet(this, _userAdmin_userList, "f"));
    }
    loginVerify(user) {
        const { nomeUser, emailUser, senhaUser } = user;
        return Array.from(__classPrivateFieldGet(this, _userAdmin_userList, "f").values()).some(userData => {
            if (!userData || typeof userData !== "object") {
                return false;
            }
            const { nome, email, senha } = userData;
            return nome === nomeUser && email === emailUser && senha === senhaUser;
        });
    }
}
exports.userAdmin = userAdmin;
_userAdmin_userList = new WeakMap();
