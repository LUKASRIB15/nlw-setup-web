import * as Checkbox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check, PersonSimple } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface HabitsListProps{
  date: Date;
  onCompletedChanged: (completed:number)=>void;
}

interface HabitsInfoProps{
  possibleHabits:{
    id: string;
    title: string;
    created_at: string;
  }[],
  completedHabits: string[];
}

export function HabitsList({date, onCompletedChanged}:HabitsListProps){
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfoProps>()

  useEffect(()=>{
    api.get("/day",{
      params:{
        date: date.toISOString()
      }
    }).then(
      (response)=>{
        setHabitsInfo(response.data)
      }
    )
  }, [])

  async function handleToogleHabit(habitId:string){
    await api.patch(`/habits/${habitId}/toggle`)
    const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)
    let completedHabits:string[]=[]

    if(isHabitAlreadyCompleted){
      completedHabits = habitsInfo!.completedHabits.filter((id)=>id!=habitId)
    }else{
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits
    })

    onCompletedChanged(completedHabits.length)
  }


  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())
  const today = dayjs(date).isSame(new Date(), "day")
  return(
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map(possibleHabit=>{
        return(
          <Checkbox.Root 
            key={possibleHabit.id} 
            className="flex items-center gap-3 group"
            checked={habitsInfo.completedHabits.includes(possibleHabit.id)}
            disabled={isDateInPast}
            onCheckedChange={()=>handleToogleHabit(possibleHabit.id)}
          >
            <div 
              className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 transition-colors"
              style={today? {cursor: "pointer"}: {cursor: "not-allowed"}}
            >
              <Checkbox.Indicator>
                <Check size={20} className="text-white"/>
              </Checkbox.Indicator>
            </div>
            <span 
              className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400"
            >
              {possibleHabit.title}
            </span>
          </Checkbox.Root>
        )
      })}
    </div>
  )
}