
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  isComingSoon?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonLink,
  isComingSoon = false
}) => {
  const isActive = status === 'active';

  return (
    <Card className="service-card border shadow-sm overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="text-find-red mb-4 text-4xl">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          {title}
          {isComingSoon ? (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
              Coming soon
            </span>
          ) : null}
        </h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-center p-6 pt-0">
        {isComingSoon ? (
          <Button className="w-full" variant="secondary" disabled>
            Coming soon
          </Button>
        ) : (
          <Button className="action-button w-full" asChild>
            <Link to={buttonLink}>{buttonText}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
