"use client";

import { Fragment } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type Crumb = { label: string; href: string };

/**
 * One-level-back navigation, not a jump to "home": the mobile back button and
 * the desktop breadcrumb's second-to-last crumb both point at the same place.
 */
export function BackNav({
  backHref,
  crumbs,
  current,
}: {
  backHref: string;
  crumbs: Crumb[];
  current: string;
}) {
  return (
    <>
      <div className="md:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link href={backHref}>
            <ChevronLeftIcon data-icon="inline-start" />
            Back
          </Link>
        </Button>
      </div>

      <div className="hidden md:block">
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb) => (
              <Fragment key={crumb.href}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ))}
            <BreadcrumbItem>
              <BreadcrumbPage>{current}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </>
  );
}
