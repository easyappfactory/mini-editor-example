import { notFound } from 'next/navigation';
import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './react-swagger';

interface Props {
  searchParams: Promise<{ key?: string }>;
}

export default async function ApiDocPage({ searchParams }: Props) {
  const { key } = await searchParams;
  const accessKey = process.env.SWAGGER_ACCESS_KEY;

  if (!accessKey || key !== accessKey) {
    notFound();
  }

  const spec = await getApiDocs() as Record<string, unknown>;
  return (
    <section className="container mx-auto p-4 bg-white text-black" style={{ colorScheme: 'light' }}>
      <ReactSwagger spec={spec} />
    </section>
  );
}
