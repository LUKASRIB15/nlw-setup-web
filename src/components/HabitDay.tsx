import * as Popover from "@radix-ui/react-popover"
import clsx from "clsx";
import { ProgressBar } from "./ProgressBar"
import * as Checkbox from "@radix-ui/react-checkbox"
import { Check } from "phosphor-react";
import dayjs from "dayjs";
import { HabitsList } from "./HabitsList";
import { useState } from "react";

interface HabitDayProps{
  completed?: number;
  amount?: number;
  date: Date;
}

export function HabitDay({completed=0, amount=0, date}:HabitDayProps){
  const [newCompleted, setNewCompleted] = useState(completed);
  const completedPercentage = amount>0 ? Math.round((newCompleted/amount)*100): 0;
  const dayAndMonth = dayjs(date).format("DD/MM")
  const dayOfWeek = dayjs(date).format("dddd")
  const today = dayjs(date).isSame(new Date(), "day");  

  function handleCompletedChanged(completed: number){
    setNewCompleted(completed)
  }
  return(
    <Popover.Root>
      <Popover.Trigger 
        className = {clsx("w-10 h-10 border-2 rounded-lg transition-all",{
          "bg-zinc-900 border-zinc-800": completedPercentage===0,
          "bg-violet-900 border-violet-700": completedPercentage>0 && completedPercentage<20,
          "bg-violet-800 border-violet-600": completedPercentage>=20 && completedPercentage<40,
          "bg-violet-700 border-violet-500": completedPercentage>=40 && completedPercentage<60,
          "bg-violet-600 border-violet-500": completedPercentage>=60 && completedPercentage<80,
          "bg-violet-500 border-violet-400": completedPercentage>=80,
        })}
        style={today?{outline: '2px solid white', border: '2px solid white'}:{outline:'2px solid transparent'}}
      />
      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>
          <ProgressBar progress={completedPercentage}/>
          <HabitsList date={date} onCompletedChanged={handleCompletedChanged}/>
          <Popover.Arrow height={8} width={16} className="fill-zinc-900"/>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}