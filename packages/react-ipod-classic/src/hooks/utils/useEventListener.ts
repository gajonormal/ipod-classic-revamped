import { useContext, useEffect, useRef } from "react";
import { IpodEventsContext } from "@/providers/IpodEventsContext";

const useEventListener = <TEvent extends string>(
  eventName: TEvent,
  handler: (event: any) => void
) => {
  const events = useContext(IpodEventsContext);
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!events) return;
    const listener = (event: Event) => savedHandler.current(event);
    events.addEventListener(eventName, listener);
    return () => events.removeEventListener(eventName, listener);
  }, [events, eventName]);
};

export default useEventListener;
