import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
  Img,
} from '@react-email/components';
import React from 'react';

interface FlightDeckPublicEmailProps {
  userFirstName: string;
  slug: string;
}
export const FlightDeckPublicEmail = ({
  userFirstName = 'User',
  slug = 'Flight Deck',
}: FlightDeckPublicEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Flight Deck is now public</Preview>
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
          <Text className={paragraph}>Hey {userFirstName},</Text>
          <Text className={paragraph}>
            Great news! Your first flight has successfully gone live on Malolo.
            It's your digital footprint, showcasing your journey and
            experiences. As a hub for digital creators passionate about
            positive, transformative content, your narrative—whether it's a
            heartfelt mission, an engaging event, or an insightful digital
            stream—is set to make an impact.
          </Text>
          <div>
            <Img
              src="https://cdn2.iconfinder.com/data/icons/pittogrammi/142/95-512.png"
              width="18"
              height="18"
              alt=""
              className="inline-block mr-1 translateY-2/4"
            />
            <Text className="inline-block text-base text-start font-bold mr-2">
              View Your Flight:
            </Text>
            <Link className="inline-block text-base" href={slug}>
              Your Flight
            </Link>
          </div>
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
            Need assistance or tips? Our Help Center is always available.
          </Text>
          <Text className={paragraph}>Cheers to your digital journey,</Text>
          <Text className={paragraph}>The Malolo Team</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default FlightDeckPublicEmail;

const main = `bg-white font-['-apple-system,BlinkMacSystemFont,"Segoe_UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica_Neue",sans-serif'] text-black`;
// const container = 'p-5 pb-12 w-[60%]';
const container = 'p-5 pb-12 px-15';
const paragraph = 'text-base leading-[26px] text-start';
