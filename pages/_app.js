import { MicroStacksProvider } from "@micro-stacks/react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import Footer from "../src/components/footer";
import Header from "../src/components/header";
import customTheme from "../theme";

function MyApp({ Component, pageProps }) {
  return (
    <MicroStacksProvider
      authOptions={{
        appDetails: {
          name: "ccips",
          icon: "logo",
        },
      }}
    >
      <ChakraProvider theme={customTheme}>
        <Header />
        <Box as="main" pt={{ base: 16, md: 32 }} pb={{ base: 24, md: 16 }}>
          <Component {...pageProps} />
        </Box>
        <Footer />
      </ChakraProvider>
    </MicroStacksProvider>
  );
}

export default MyApp;
