import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';
import React from 'react';

interface MaloloWelcomeEmailProps {
  userFirstName: string;
}
export const MaloloWelcomeEmail = ({
  userFirstName = 'User',
}: MaloloWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to DKE</Preview>
    <Tailwind>
      <Body className={main}>
        <Container className={container} style={{ maxWidth: 'unset' }}>
          <Img
            src="https://i.imgur.com/TQeS7ZG.png"
            width="110"
            height="50"
            alt=""
            className="inline-block mr-1 translateY-2/4"
          />
          <Text className={paragraph}>
            Hi <b>{userFirstName}</b>,
          </Text>
          <Text className={paragraph}>
            Hello! You've joined the DKE elearning community through Gmail. Get
            ready to "take off" and create your own knowledge flights, share
            exciting learning adventures with us!
          </Text>
          <Text className={paragraph}>Take off with DKE elearning!</Text>
          <Link className={`block ${paragraph}`} href={process.env.PUBLIC_URL}>
            [Link to Dashboard]
          </Link>
          <Text className={paragraph}>
            Every learning journey opens a story waiting to be told.At DKE
            elearning, the knowledge you gain will equip you for exciting
            discoveries.
          </Text>
          <Text className={paragraph}>Fly true,</Text>
          <Text className={paragraph}>The DKE Team</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default MaloloWelcomeEmail;
const main = `bg-white font-['-apple-system,BlinkMacSystemFont,"Segoe_UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica_Neue",sans-serif'] text-black`;
// const container = 'p-5 pb-12 w-[60%]';
const container = 'p-5 pb-12 px-15';
const paragraph = 'text-base leading-[26px] text-start';
