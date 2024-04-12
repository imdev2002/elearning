import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';
import React from 'react';

interface MaloloDeleteAccountEmailProps {
  userFirstName: string;
}
export const MaloloDeleteAccountEmail = ({
  userFirstName = 'User',
}: MaloloDeleteAccountEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>We're sorry to see you go!</Preview>
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
              Hello <b>{userFirstName}</b>,
            </Text>
            <Text className={paragraph}>
              We're writing to confirm that your account and all associated data
              with Malolo have been successfully deleted as per your request.
            </Text>
            <Text className={paragraph}>A few important notes:</Text>
            <ul className="ml-5">
              <li className={paragraph}>
                <b>Data Removal:</b> Rest assured, all your personal data and
                content have been permanently removed from our servers in
                compliance with privacy standards.
              </li>
              <li className={paragraph}>
                <b>Feedback:</b> We're always looking to improve. If you have
                any feedback or suggestions about your experience, we're all
                ears. Please consider letting us know how we can better serve
                users like you in the future.
              </li>
              <li className={paragraph}>
                <b>Rejoining Malolo:</b> Should you ever wish to return and
                craft new flights with us, know that our skies will always be
                open for you. Just create a new account, and you're back in!
              </li>
            </ul>
            <Text className={paragraph}>
              Thank you for being a part of the Malolo community. Wishing you
              all the best on your future endeavors, wherever they may take you.
            </Text>
            <Text className={paragraph}>Warm regards,</Text>
            <Text className={paragraph}>The Malolo Team</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MaloloDeleteAccountEmail;

const main = `bg-white font-['-apple-system,BlinkMacSystemFont,"Segoe_UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica_Neue",sans-serif'] text-black`;
// const container = 'p-5 pb-12 w-[60%]';
const container = 'p-5 pb-12 px-15';
const paragraph = 'text-base leading-[26px] text-start';
