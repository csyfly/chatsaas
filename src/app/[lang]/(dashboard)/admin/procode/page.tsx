"use client"

import { useEffect, useState } from "react";
import { getPromoCodes, createPromoCode } from "@/actions/procode";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PromoCode } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
// export const runtime = 'edge';

const ProCodePage = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const { user } = useUser();
  
  useEffect(() => {
    const fetchPromoCodes = async () => {
      const codes = await getPromoCodes();
      setPromoCodes(codes as PromoCode[]);
    };
    fetchPromoCodes();
  }, []);

  if (!user || user?.emailAddresses[0].emailAddress !== 'chenzhaoyi9909@gmail.com') {
    return <div></div>;
  }
  
  const handleCreatePromoCode = async () => {
    try {
      // 生成随机的促销码
      const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      };

      const code = generateRandomCode();
      
      const newCode = await createPromoCode(code, 30, "test");
      setPromoCodes([...promoCodes, newCode]);
    } catch (error) {
      console.error("Failed to create promo code:", error);
      // 这里可以添加错误处理，比如显示一个错误提示
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Pro Code Page</h1>
        <Button onClick={handleCreatePromoCode}>Create Promo Code</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pro Code</TableHead>
            <TableHead>Pro Days</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Used By</TableHead>
            <TableHead>Used At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promoCodes.map((code) => (
            <TableRow key={code.id}>
              <TableCell>{code.code}</TableCell>
              <TableCell>{code.days}</TableCell>
              <TableCell>{code.description}</TableCell>
              <TableCell>{new Date(code.expiredAt).toLocaleDateString()}</TableCell>
              <TableCell>{code.isUsed ? "Used" : "Not Used"}</TableCell>
              <TableCell>{code.usedBy?.name}</TableCell>
              <TableCell>{code.usedAt ? new Date(code.usedAt).toLocaleDateString() : "Not Used"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProCodePage;