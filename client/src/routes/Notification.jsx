import Header from "../components/Header";
import Footer from "../components/Footer";
import { axios } from "../utils/axios.js";
import { useState, useEffect } from "react";
import { sortAndFormatDate } from "../utils/formatDate.js";
function NotificationComponent({ avatar, name, text, createdAt }) {
  return (
    <div className="py-2 flex items-center border-solid border-b-gray-800 border-b-[1px]">
      <img src={avatar} className="w-12 h-12 rounded-full" />
      <div className="flex flex-col mx-2">
        <h2 className="mx-2 text-md text-gray-400">
          <strong className="capitalize">{name}</strong> {text}
        </h2>
        <h4 className="mx-2 text-md text-gray-500">
          {sortAndFormatDate(createdAt)} ago
        </h4>
      </div>
    </div>
  );
}
export default function Notification() {
  const [notifications, setNotifications] = useState(null);
  useEffect(function () {
    axios.get("/notifications").then(({ data }) => {
      setNotifications(data);
    });
  }, []);
  const notificationProps = (curr) => ({
    avatar: curr.image,
    name: curr.name,
    text: curr.text,
    createdAt: curr.createdAt,
  });
  return (
    <section className="">
      <Header />
      <h2 className="text-lg mx-2 font-medium text-white py-2">
        Notifications
      </h2>
      <hr className="border-gray-800" />
      <section className="mx-2">
        {notifications &&
          notifications.map((each) => (
            <>
              <NotificationComponent {...notificationProps(each)} />
            </>
          ))}
      </section>
      <Footer />
    </section>
  );
}
