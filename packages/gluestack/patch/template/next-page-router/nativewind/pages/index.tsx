import Head from 'next/head';
import type { NextPage } from 'next';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

const Meta = () => {
  return (
    <Head>
      <title>Create Gluestack App</title>
      <meta name="description" content="Generated by node glue add web" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

const Container = () => {
  return (
    <Box className="flex-1 bg-black h-[100vh] flex-row justify-center items-center">
      <Text className="text-white font-normal">Get started by editing</Text>
      <Text className="text-white font-normal ml-2">
        <code>pages/index.tsx</code>
      </Text>
    </Box>
  );
};

const Home: NextPage = () => {
  return (
    <div>
      <Meta />
      <Container />
    </div>
  );
};

export default Home;
