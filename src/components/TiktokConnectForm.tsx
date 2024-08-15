'use client'

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const handleTiktokConnect = () => {
  window.open('/api/tiktok', 'tiktok', 'width=500,height=800')
}

const TiktokConnectForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>TikTok</CardTitle>
        <CardDescription>Login with TikTok to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleTiktokConnect}>
          Login with TikTok
        </Button>
      </CardContent>
    </Card>
  );
}

export default TiktokConnectForm;
