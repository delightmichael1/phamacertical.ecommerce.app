import React from "react";
import Button from "../buttons/Button";
import GlassSurface from "./GlassSurface";
import { GoDotFill } from "react-icons/go";
import useAppStore from "@/stores/AppStore";
import cn from "@/utils/cn";

interface Props {
  title: string;
  offer: string;
  options: string[];
  side: "right" | "left" | "center";
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

function PricingCard(props: Props) {
  return (
    <GlassSurface
      borderRadius={24}
      className={cn(
        "relative flex flex-col space-y-4 w-full",
        props.side === "center" && "scale-105"
      )}
    >
      <div className="flex flex-col space-y-10 p-6 w-full h-full">
        <h3 className="mx-auto font-semibold text-2xl text-center">
          {props.title}
        </h3>
        <div className="flex justify-center items-end">
          <span className="font-semibold text-4xl">{props.offer}</span>
          <span>/month</span>
        </div>
        <div className="flex flex-col space-y-2">
          {props.options.map((option) => (
            <div key={option} className="flex items-center space-x-4 text-sm">
              <GoDotFill className="w-4 h-4" />
              <span>{option}</span>
            </div>
          ))}
        </div>
        <Button
          className="rounded-xl text-black text-sm"
          onClick={() => {
            useAppStore.setState((state) => {
              props.setStep(1);
              state.selectedPlan = props.title.replace(" ", "_").toLowerCase();
            });
          }}
        >
          Select
        </Button>
      </div>
    </GlassSurface>
  );
}

export default PricingCard;
