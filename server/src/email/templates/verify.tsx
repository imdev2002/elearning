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

export const VerifyEmail = ({
  userFirstName = 'User',
  verifyCode = '000000',
}) => (
  <Html>
    <Head />
    <Preview>Your Flight Deck is now public</Preview>
    <Tailwind>
      <Body className={main}>
        <Container className={container} style={{ maxWidth: 'unset' }}>
          <Img
            src="https://media.istockphoto.com/id/1156285298/vector/futuristic-education-technology-page-for-smartphone-application-isometric-banner-for-online.jpg?s=612x612&w=0&k=20&c=kxDHdQ59S6Q_3BLAfs8OPWVxZa9Bevu1SZPxn7LEoTw="
            width="0"
            height="0"
            sizes="1000px"
            alt=""
            className="inline-block mr-1 translateY-2/4 w-full object-cover h-full"
          />
          <Text className={paragraph}>Dear {userFirstName},</Text>
          <Text className={paragraph}>
            We have received a request to verify your account on the{' '}
            <b>DKEducation</b>. This is an important step to ensure the security
            of your account and provide you with the best learning experience.
          </Text>
          <Link
            className="block text-base mx-auto w-fit px-12 py-4 bg-blue-500 text-white font-semibold rounded-md"
            href={`${process.env.PUBLIC_URL}/verify?verify=${verifyCode}`}
          >
            Verify
          </Link>
          <Text className="text-base text-start font-bold">What next?</Text>
          <div className="ml-5">
            <Text className={paragraph}>
              1. <b>Broaden Your Reach:</b> Amplify your message; share your
              flight and let it resonate with a wider audience.
            </Text>
            <Text className={paragraph}>
              2. <b>Value in Feedback:</b> Engage with peers and community
              members. Their insights can be a catalyst for your next creation
            </Text>
            <Text className={paragraph}>
              3. <b>Diversify Your Space:</b> Remember, you can curate up to 6
              more flights, spotlighting everything from uplifting stories,
              meaningful events, to enlightening broadcasts.
            </Text>
          </div>
          <Text className={paragraph}>
            If you did not make this request, please disregard this email. If
            you encounter any issues or require additional support, please
            contact us at support@dkeducation.com.
          </Text>
          <Text className={paragraph}>
            Thank you and we wish you an enjoyable learning experience on the{' '}
            <b>DKEducation</b>.
          </Text>
          <Text className={paragraph}>DKEducation</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default VerifyEmail;

const main = `bg-white font-['-apple-system,BlinkMacSystemFont,"Segoe_UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica_Neue",sans-serif'] text-black`;
// const container = 'p-5 pb-12 w-[60%]';
const container = 'p-5 pb-12 px-15';
const paragraph = 'text-base leading-[26px] text-start';
