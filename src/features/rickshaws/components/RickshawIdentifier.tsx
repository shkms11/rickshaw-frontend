import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type RickshawIdentification = {
  plateNo: string;
  phoneNumber: string;
};

type RickshawIdentifierProps = {
  onIdentify: (identification: RickshawIdentification) => void;
  isLoading?: boolean;
};

export default function RickshawIdentifier({
  onIdentify,
  isLoading = false,
}: RickshawIdentifierProps) {
  const [plateNo, setPlateNo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onIdentify({
      plateNo: plateNo.trim(),
      phoneNumber: phoneNumber.trim(),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identify a rickshaw</CardTitle>
        <CardDescription>
          Enter the license plate and phone number to find a rickshaw.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="rickshaw-plate-number">License plate number</Label>
            <Input
              id="rickshaw-plate-number"
              name="plateNo"
              autoComplete="off"
              value={plateNo}
              onChange={(event) => setPlateNo(event.target.value)}
              placeholder="Enter license plate number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rickshaw-phone-number">Phone number</Label>
            <Input
              id="rickshaw-phone-number"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <Search aria-hidden="true" />
            {isLoading ? "Searching..." : "Identify rickshaw"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
