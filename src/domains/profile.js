async function updateAvatar(User, userId, avatar) {
  const { nModified } = await User.updateOne(
    { _id: userId },
    { $set: { avatar } },
  );
  if (nModified === 0) {
    return { error: 'user does not exist' };
  }
  return { error: null };
}

export default { updateAvatar };
