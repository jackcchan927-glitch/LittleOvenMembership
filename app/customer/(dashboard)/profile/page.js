import { getCurrentCustomer } from "@/lib/session";
import ProfileManager from "./ProfileManager";

export default async function ProfilePage() {
  const customer = await getCurrentCustomer();
  const plain = {
    name: customer.name,
    email: customer.email,
    phone: customer.phone || "",
    birthday: customer.birthday ? new Date(customer.birthday).toISOString().slice(0, 10) : "",
  };
  return <ProfileManager customer={plain} />;
}
