'use client';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

export default function ProtectedPage() {
  return <div>Esta es una página protegida ✅</div>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return { props: { session } };
}
