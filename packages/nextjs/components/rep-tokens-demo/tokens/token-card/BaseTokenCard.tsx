import { Token } from "../Hooks";
import { BalanceCard } from "./BalanceCard";
import { ImageCard } from "./ImageCard";
import { ImageProperties } from "./ImageCard";
import { StringCard } from "./StringCard";

export type TContainerAndValuePair = {
  container: string;
  value: string;
};

type TTokenProps = {
  token: Token;
  imageProperties?: ImageProperties;
  propertiesClasses?: TBaseTokenCardPropertiesClasses;
  prettifyLoadingProps?: TBaseTokenCardBooleanSet;
  renderProps?: TBaseTokenCardBooleanSet;
};

export type TBaseTokenCardPropertiesClasses = {
  balance: TContainerAndValuePair;
  name: TContainerAndValuePair;
  description: TContainerAndValuePair;
  image: TContainerAndValuePair;
};

export type TBaseTokenCardBooleanSet = {
  balance: boolean;
  name: boolean;
  description: boolean;
  image: boolean;
};

export const BaseTokenCard = ({
  token,
  imageProperties,
  propertiesClasses,
  prettifyLoadingProps,
  renderProps = { balance: true, image: true, name: true, description: true },
}: TTokenProps) => {
  return (
    <>
      {renderProps.balance ? (
        <BalanceCard
          value={token.balance}
          propertyClasses={propertiesClasses?.balance}
          prettifyLoading={prettifyLoadingProps?.balance}
        ></BalanceCard>
      ) : (
        <></>
      )}
      {renderProps.image ? (
        <ImageCard
          value={token.image}
          imageProperties={imageProperties}
          propertyClasses={propertiesClasses?.image}
          prettifyLoading={prettifyLoadingProps?.image}
        ></ImageCard>
      ) : (
        <></>
      )}
      {renderProps.name ? (
        <StringCard
          value={token.name}
          propertyClasses={propertiesClasses?.name}
          prettifyLoading={prettifyLoadingProps?.name}
        ></StringCard>
      ) : (
        <></>
      )}
      {renderProps.description ? (
        <StringCard
          value={token.description}
          propertyClasses={propertiesClasses?.description}
          prettifyLoading={prettifyLoadingProps?.description}
        ></StringCard>
      ) : (
        <></>
      )}
    </>
  );
};
