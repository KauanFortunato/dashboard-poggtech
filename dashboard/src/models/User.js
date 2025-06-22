export class User {
  constructor({ user_id, firebase_uid, name, email, avatar, phone, type, created_at }) {
    this.user_id = user_id;
    this.firebase_uid = firebase_uid;
    this.name = name;
    this.email = email;
    this.avatar = avatar; // URL do avatar
    this.phone = phone;
    this.type = type; // 'admin' ou 'user'
    this.created_at = created_at; // Data de criação do usuário
  }

  getUserId() {
    return this.user_id || "ID não fornecido";
  }

  getName() {
    return this.name || "Usuário sem nome";
  }

  getFirebaseUid() {
    return this.firebase_uid;
  }

  getEmail() {
    return this.email || "Email não fornecido";
  }

  getAvatar() {
    return this.avatar || "http://poggers.ddns.net/PoggTech-APIs/uploads/avatars/poggers-11645679-default-avatar.png";
  }

  getPhone() {
    return this.phone || "Número de telemóvel não fornecido";
  }

  getType() {
    return this.type || "Tupo de utilizador não especificado";
  }

  getCreatedAt() {
    return this.created_at;
  }

  setName(newName) {
    this.name = newName;
  }
}
