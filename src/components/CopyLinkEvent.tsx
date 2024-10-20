"use client";

import { Link2 } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { toast } from "sonner";

type Props = {
  copyLinkUrl: string;
};

function CopyLinkEvent({ copyLinkUrl }: Props) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(copyLinkUrl);
      toast.success("URL berhasil di copy!");
    } catch (error) {
      console.error(error);
      toast.error(`Something went wrong ${error}`);
    }
  };

  return (
    <DropdownMenuItem onSelect={handleCopyLink}>
      <Link2 className="mr-2 size-4" />
      Copy Link
    </DropdownMenuItem>
  );
}

export default CopyLinkEvent;
