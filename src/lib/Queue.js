import Bee from 'bee-queue';
import OrderRegisteredMail from '../app/jobs/OrderRegisteredMail';
import DeliveryCanceledMail from '../app/jobs/DeliveryCanceledMail';
import redisConfig from '../config/redis';

const jobs = [OrderRegisteredMail, DeliveryCanceledMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    /**
     * Para cara jobs registrada no array, cria-se uma fila na variavel queues
     */
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          // bee instancia que armazena a referencia do bee
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    /**
     *
     */
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED `, err);
  }
}

export default new Queue();
