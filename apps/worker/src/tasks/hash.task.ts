import bcrypt from 'bcrypt';

export async function bcryptHash(rounds: number): Promise<string> {
  const password = 'kubernatis_padh_rahen_ham';

  const salt = await bcrypt.genSalt(rounds);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}
