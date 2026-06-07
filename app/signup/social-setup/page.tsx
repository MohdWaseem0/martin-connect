import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SocialSetupClient from './SocialSetupClient';

export default async function SocialSetupPage() {
  const cookieStore = await cookies();
  const tempUser = cookieStore.get('temp_social_user')?.value;

  if (!tempUser) {
    redirect('/login');
  }

  let userDetails = { email: '', name: '' };
  try {
    userDetails = JSON.parse(tempUser);
  } catch (e) {
    redirect('/login');
  }

  return <SocialSetupClient initialEmail={userDetails.email} initialName={userDetails.name} />;
}
