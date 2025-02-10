const newRoom =
  "INSERT INTO party_rooms (name, description, thumbnail, owner_id) VALUES ($1, $2, $3, $4) RETURNING *";

module.exports = {
  newRoom,
};
